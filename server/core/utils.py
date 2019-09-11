import csv
import itertools
import re

from jsonschema import validate
from io import BytesIO
from zipfile import ZipFile

import pandas as pd
import geopandas as gpd

from django.contrib.gis.geos import GEOSGeometry
from django.http import HttpResponse

import logging

from astrosat.utils import RestrictLogsByNameFilter


###########
# reports #
###########


def data_to_csv(data, filename="report"):
    """
    Takes a sequence of sequences and returns it as CSV attachment.
    The first entry should be the headers.
    Using a streaming response just in case the data is really big.
    """
    csv_response = HttpResponse(content_type="text/csv")
    csv_response["Content-Disposition"] = f"attachment; filename={filename}"

    writer = csv.writer(csv_response)
    for row in data:
        writer.writerow(row)

    return csv_response


def responses_to_archive(responses, filename="report"):

    archive_response = HttpResponse(content_type="application/zip")
    archive_response["Content-Disposition"] = f"attachment; filename={filename}"

    buffer = BytesIO()
    archive = ZipFile(buffer, "a")
    for response in responses:
        response_filename = re.findall("filename=(.+);?",response.get("Content-Disposition"))[0]
        archive.writestr(response_filename, response.content)
    archive.close()
    buffer.seek(0)
    archive_response.write(buffer.read())

    return archive_response


#############
# iterators #
#############

# from https://docs.python.org/3/library/itertools.html#itertools-recipes

def grouper(iterable, n, fillvalue=None):
    "Collect data into fixed-length chunks or blocks"
    # grouper('ABCDEFG', 3, 'x') --> ABC DEF Gxx"
    args = [iter(iterable)] * n
    return itertools.zip_longest(*args, fillvalue=fillvalue)


###################
# data processing #
###################


def select_and_rename_columns(df, columns, index_name=None):
    """Select and rename columns in pandas.DataFrame
    Parameters
    ----------
    df : pandas.DataFrame
        Input data.
    columns : dict
        Column names. Example: {'name_before': 'name_after', ... }.
    index_name : string (optional)
        If provided, column named 'index_name' will be set as index.
    Returns
    -------
    pandas.DataFrame
        Input data with only the selected columns and the columns
        renamed.
    """
    df = df[list(columns.keys())]
    df = df.rename(columns=columns)
    if index_name:
        df = df.set_index(index_name)
    return df


def combine_data_frames(left, right):
    """
    Combines 2 data_frames, where the right frame has precedance.
    """

    assert left.index.name is not None and left.index.name == right.index.name

    df = right.combine_first(left)
    df = df.where((pd.notnull(df)), None)
    return df

class RestrictGeopandasFilter(RestrictLogsByNameFilter):

    """
    GeoPandas uses Shapely under the hood,
    which outputs loads of pointless messages about GDAL
    this silences the unimportant ones while running locally
    (see "core/settings/development.py#LOGGING['filters']")
    """

    names_to_restrict = "shapely|fiona"  # converted to regex
    level_to_allow = logging.INFO
