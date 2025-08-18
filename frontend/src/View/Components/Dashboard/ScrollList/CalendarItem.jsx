const CalendarItem = ({ item, style }) => {
    return (
        <div className="Calendar-item" style={{ ...style }}>
            <div className="item-name" style={{ maxWidth: "20%", whiteSpace: "nowrap" }}>
                {item.title}
            </div>
            <div className="item-date">{item.date}</div>
        </div>
    );
};
export default CalendarItem;