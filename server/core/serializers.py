from rest_framework import serializers

from .models import Bookmark

class BookmarkSerializer(serializers.ModelSerializer):
    """ Serialize Bookmark objects. """
    class Meta(object):
        model = Bookmark
        fields = ('id', 'title', 'center', 'zoom', 'source')

class CRUDListSerialilzer(serializers.ListSerializer):

    """
    A ListSerializer that can create/update/delete in a single go.
    Useful for nested writable serializers.
    """

    def crud(self, instances=[], validated_data=[], delete_missing=True):

        models = []

        # map of existing instances...
        instance_mapping = {
            instance.id: instance
            for instance in instances
        }

        # map of instances specified in data...
        data_mapping = {
            data.get("id", id(data)): data
            for data in validated_data
        }

        # create every instance in data_mapping NOT in instance_mapping
        # update every instance in data_mapping AND in instance_mapping
        for model_id, model_data in data_mapping.items():
            model = instance_mapping.get(model_id, None)
            if model is None:
                models.append(
                    self.child.create(model_data)
                )
            else:
                models.append(
                    self.child.update(model, model_data)
                )

        # remove every instance in instance_mapping NOT in data_mapping
        for model_id, model in instance_mapping.items():
            if model_id not in data_mapping:
                # TODO: JUST REMOVE THE model FROM THE parent
                if delete_missing:
                    model.delete()

        return models


class AbstractCRUDSerializer(serializers.ModelSerializer):
    """
    A Serializer that can create/update/delete in a single go.
    Useful for nested writable serializers.
    """

    # TODO: IT WOULD BE PREFERABLE TO MAKE CRUDSerializer
    # TODO: TO AUTOMATICALLY USE CRUDListSerializer
    # class Meta:
    #     list_serializer_class = CRUDListSerialilzer

    def to_internal_value(self, data):

        internal_value = super().to_internal_value(data)

        # put id back so I can tell if the underlying instance exists
        _id = data.get("id", None)
        if _id:
            internal_value["id"] = _id

        return internal_value

    def crud(self, instance=None, valildated_data={}, delete_missing=True):
        msg = "CRUDSerializer must implement the crud() method"
        raise NotImplementedError(msg)
