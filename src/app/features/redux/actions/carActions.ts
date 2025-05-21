import axios from "axios";

import { Dispatch } from "redux";

export const addCar = (FormData: FormData) => async (dispatch: Dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const { data } = await axios.post('http://localhost:7000/api/cars', FormData, config);
        dispatch({ type: 'ADD_CAR_SUCCESS', payload: data });
    } catch (error) {
        let errorMessage = "An unknown error occurred";
        if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data?.message || error.message;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        dispatch({ type: 'ADD_CAR_FAIL', payload: errorMessage });
    }
};