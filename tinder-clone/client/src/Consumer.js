import { useContext } from "react";
import { LoadingContext } from './App';

const useLoading = () => useContext(LoadingContext);

export { useLoading };
