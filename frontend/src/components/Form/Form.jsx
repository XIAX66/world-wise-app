// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import styles from "./Form.module.css";
import Button from "../Button/Button";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { useCities } from "../../contexts/CitiesContext";
import { useUrlPosition } from "../../hooks/useUrlPosition";
import axios from "axios";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

// eslint-disable-next-line react-refresh/only-export-components
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useUrlPosition();
  const navigate = useNavigate();
  const { isLoading, createCity } = useCities();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchCity() {
      try {
        setIsLoadingGeolocation(true);
        const res = await axios.get(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.data;

        if (!data.city) {
          setCityName("Unknown city");
          setCountry("Unknown country");
          setEmoji("");
        }

        setCityName(data.city);
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        console.err(err);
      } finally {
        setIsLoadingGeolocation(false);
      }
    }
    fetchCity();
  }, [lat, lng]);

  if (isLoadingGeolocation) return <Spinner />;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !country) return;

    const newCity = {
      cityName,
      country,
      date: date.toISOString(),
      notes,
      emoji,
      position: { lat, lng },
    };

    await createCity(newCity);

    navigate("/app/cities");
  }
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate("/app");
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
