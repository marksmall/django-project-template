import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'jest-enzyme';

import fetchMock from 'jest-fetch-mock';

jest.mock('mapbox-gl', () => ({ ScaleControl: jest.fn() }));

configure({ adapter: new Adapter() });

global.fetch = fetchMock;
