import { useReducer, useEffect } from 'react';

const initialState = {
  values: {},
  errors: {},
  isSubmitting: false
};

const SET_VALUES = 'SET_VALUES';
const SET_ERRORS = 'SET_ERRORS';
const SET_IS_SUBMITTING = 'SET_IS_SUBMITTING';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_VALUES:
      return {
        ...state,
        values: action.values
      };

    case SET_ERRORS:
      return {
        ...state,
        errors: action.errors
      };

    case SET_IS_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };

    default:
      throw new Error('UNKNOWN ACTION TYPE');
  }
};

const useForm = (callback, validate) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (Object.keys(state.errors).length === 0 && state.isSubmitting) {
      callback();
      dispatch({ type: SET_IS_SUBMITTING, isSubmitting: false });
    }
  }, [state.errors, state.isSubmitting, callback]);

  const handleSubmit = event => {
    if (event) event.preventDefault();

    dispatch({ type: SET_IS_SUBMITTING, isSubmitting: true });
  };

  const handleChange = event => {
    event.persist();

    const newValues = {
      ...state.values,
      [event.target.name]: event.target.value.trim()
    };

    dispatch({ type: SET_ERRORS, errors: validate(newValues) });
    dispatch({ type: SET_VALUES, values: { ...state.values, ...newValues } });
  };

  const reset = () => {
    dispatch({ type: SET_ERRORS, errors: {} });
    dispatch({ type: SET_VALUES, values: {} });
  };

  return {
    handleChange,
    handleSubmit,
    reset,
    values: state.values,
    errors: state.errors
  };
};

export default useForm;
