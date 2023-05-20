import { DragSource } from 'react-dnd';
import { ItemTypes } from '../ItemTypes'; // Define the item types

const NFTImage = ({ nft, onAdd, onRemove, connectDragSource, isDragging }) => {
  return connectDragSource(
    <div style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={nft.metadata} />
    </div>
  );
};

const dragSourceSpec = {
  beginDrag(props) {
    return { nft: props.nft };
  },
};

const dragSourceCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource(ItemTypes.NFT, dragSourceSpec, dragSourceCollect)(NFTImage);

