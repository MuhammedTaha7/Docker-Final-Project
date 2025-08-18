import "../../../../CSS/Components/Global/ScrollList.css";
const ScrollListItem = ({ item }) => {
    return (
        <div className="scroll-list-item">
            <div className="item-name" style={{ maxWidth: "20%",  whiteSpace: "nowrap"}}>{item.title}</div>
            <div className="item-date">{item.date}</div>
            <button className="item-button">View</button>
        </div>
    );
}
export default ScrollListItem