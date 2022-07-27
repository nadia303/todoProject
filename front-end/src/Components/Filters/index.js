import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";
import { FILTERS } from "../../utils";

import "./styles.css";

const FiltersBar = ({ setFilterType }) => {
  const { activeLanguage } = useLanguageSwitcher();

  return (
    <div className="filters-bar">
      <button
        className="filters-bar__btn"
        onClick={() => setFilterType(FILTERS.ALL)}
      >
        {activeLanguage === "EN" ? "All" : "Всі"}
      </button>
      <button
        className="filters-bar__btn"
        onClick={() => setFilterType(FILTERS.DONE)}
      >
        {activeLanguage === "EN" ? "Done" : "Виконані"}
      </button>
      <button
        className="filters-bar__btn"
        onClick={() => setFilterType(FILTERS.TODO)}
      >
        {activeLanguage === "EN" ? "Todo" : "Не виконані"}
      </button>
    </div>
  );
};

export default FiltersBar;
