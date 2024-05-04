import { useState } from 'react';
import { Modal, Input } from 'antd';

interface UpdateModalProps {
  visible: boolean;
  onCancel: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ visible, onCancel }) => {
  const [activity, setActivity] = useState('');
  const [completeBy, setCompleteBy] = useState('');
  const [clickCount, setClickCount] = useState(0);

  const updateModal = () => {
    setClickCount(prevCount => prevCount + 1);
  };

  const handleOk = () => {
    const requestData = {
      activity: activity,
      completeBy: completeBy
    };
    // Handle submission logic here
    onCancel(); // Close modal after submission
  };

  // Set default values based on click count
  const defaultActivity = clickCount === 1 ? 'In Progress' : '';
  const defaultCompleteBy = clickCount === 1 ? 'Default Date' : '';

  return (
    <>
      <button onClick={updateModal}>Update</button>
      <Modal
        title="ToDo"
        visible={visible}
        onOk={handleOk}
        onCancel={onCancel}
      >
        <div style={{ display: 'flex', gap: '20px', margin: '25px', marginLeft: '20%', width: '50%' }}>
          <label style={{ width: '30%' }}>Activity:</label>
          <Input
            placeholder='Enter Activity'
            value={activity}
            onChange={e => setActivity(e.target.value)}
            defaultValue={defaultActivity} // Set default value here
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '25px', marginLeft: '20%', width: '50%' }}>
          <label style={{ width: '30%' }}>Complete by Date:</label>
          <Input
            placeholder='Enter Date'
            value={completeBy}
            onChange={e => setCompleteBy(e.target.value)}
            defaultValue={defaultCompleteBy} // Set default value here
          />
        </div>
      </Modal>
    </>
  );
};

export default UpdateModal;
