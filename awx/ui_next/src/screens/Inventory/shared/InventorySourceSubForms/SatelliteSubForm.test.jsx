import React from 'react';
import { act } from 'react-dom/test-utils';
import { Formik } from 'formik';
import { mountWithContexts } from '../../../../../testUtils/enzymeHelpers';
import SatelliteSubForm from './SatelliteSubForm';
import { CredentialsAPI } from '../../../../api';

jest.mock('../../../../api/models/Credentials');

const initialValues = {
  credential: null,
  custom_virtualenv: '',
  overwrite: false,
  overwrite_vars: false,
  source_path: '',
  source_project: null,
  source_script: null,
  source_vars: '---\n',
  update_cache_timeout: 0,
  update_on_launch: true,
  update_on_project_update: false,
  verbosity: 1,
};

describe('<SatelliteSubForm />', () => {
  let wrapper;
  CredentialsAPI.read.mockResolvedValue({
    data: { count: 0, results: [] },
  });

  beforeAll(async () => {
    await act(async () => {
      wrapper = mountWithContexts(
        <Formik initialValues={initialValues}>
          <SatelliteSubForm />
        </Formik>
      );
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
    wrapper.unmount();
  });

  test('should render subform fields', () => {
    expect(wrapper.find('FormGroup[label="Credential"]')).toHaveLength(1);
    expect(wrapper.find('FormGroup[label="Verbosity"]')).toHaveLength(1);
    expect(wrapper.find('FormGroup[label="Update options"]')).toHaveLength(1);
    expect(
      wrapper.find('FormGroup[label="Cache timeout (seconds)"]')
    ).toHaveLength(1);
    expect(
      wrapper.find('VariablesField[label="Source variables"]')
    ).toHaveLength(1);
  });

  test('should make expected api calls', () => {
    expect(CredentialsAPI.read).toHaveBeenCalledTimes(1);
    expect(CredentialsAPI.read).toHaveBeenCalledWith({
      credential_type__namespace: 'satellite6',
      order_by: 'name',
      page: 1,
      page_size: 5,
    });
  });
});
