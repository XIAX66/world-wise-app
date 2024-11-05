import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import { useCities } from "../../contexts/CitiesContext";
import Spinner from "../Spinner/Spinner";
import Message from "../Massage/Message";

function CountryList() {
  const { countries, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!countries.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.countryList}>
      {countries.map((country, index) => (
        <CountryItem country={country} key={index} />
      ))}
    </ul>
  );
}

export default CountryList;
