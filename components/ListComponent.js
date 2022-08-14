import * as Ri from 'react-icons/ri'
const ListComponent = ({ values, onchange, type }) => {
  return (
    <div className="custom-select">
      <select value={type} onChange={onchange} className="search-select">
        <option value="all">All</option>
        {values &&
          values.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
      </select>
      <span className="custom-arrow">
        <Ri.RiArrowDownSLine size={25}/>
      </span>
    </div>
  );
};

export default ListComponent;
