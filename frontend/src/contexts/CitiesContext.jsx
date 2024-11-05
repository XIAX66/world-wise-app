import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/v1";

const CitiesContext = createContext();

const initialState = {
  currentCity: {},
  cities: [],
  isLoading: false,
  error: null,
  countries: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "countries/loaded":
      return {
        ...state,
        isLoading: false,
        countries: action.payload,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Invalid action type");
  }
};

const CitiesProvider = ({ children }) => {
  const [{ currentCity, cities, error, isLoading, countries }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: "loading" });
      try {
        const res = await axios.get(`${BASE_URL}/cities`);
        const data = res.data.data.cities;
        console.log(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        alert("Error fetching cities: ", error);
        dispatch({ type: "rejected", payload: error });
      }
    };
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (id * 1 === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const res = await axios.get(`${BASE_URL}/cities/${id}`);
        const data = await res.data;
        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        console.err("Error fetching cities: ", err);
        dispatch({ type: "rejected", payload: err });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await axios.post(`${BASE_URL}/cities`, newCity, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.data;
      dispatch({ type: "city/created", payload: data.data });
    } catch (err) {
      console.err("Error fetching cities: ", err);
      dispatch({ type: "rejected", payload: err });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await axios.delete(`${BASE_URL}/cities/${id}`);
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      console.err("Error fetching cities: ", err);
      dispatch({ type: "rejected", payload: err });
    }
  }

  async function getCountries() {
    dispatch({ type: "loading" });
    try {
      const res = await axios.get(`${BASE_URL}/cities/countries`);
      const data = await res.data;
      const countries = data.reduce((arr, item) => {
        if (!arr.map((el) => el.country).includes(item.country))
          return [...arr, { country: item.country, emoji: item.emoji }];
        else return [...arr];
      }, []);
      dispatch({ type: "city/deleted", payload: countries });
    } catch (err) {
      console.err("Error fetching cities: ", err);
      dispatch({ type: "rejected", payload: err });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        countries,
        getCity,
        createCity,
        deleteCity,
        getCountries,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was user outside of the CitiesProvider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
