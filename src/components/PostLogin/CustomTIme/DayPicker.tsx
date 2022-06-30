const DayPicker = ({day, setFieldValue, letter}) => (
  <>
    <label
      className={day ? `customAvailabilityLabel bg-mainBlue text-white` : `customAvailabilityLabel`}
    >
      {letter}
      <input
        type='checkbox'
        name={day}
        value={day}
        checked={day}
        className='hidden'
        onChange={setFieldValue}
      />
    </label>
  </>
);
export default DayPicker;
