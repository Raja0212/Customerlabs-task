import React, { useState } from 'react';
import './App.css';

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ]);

  const [selectedOption, setSelectedOption] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const handleSaveSegmentClick = () => {
    setIsButtonVisible(false); 
    setIsPopupOpen(true);

  };

  const handleAddNewSchema = () => {
    if (selectedOption) {
      // Add selected option to selectedSchemas and remove from availableOptions
      const newSchema = availableOptions.find(opt => opt.value === selectedOption);
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setAvailableOptions(availableOptions.filter(opt => opt.value !== selectedOption));
      setSelectedOption('');
    }
  };

  const handleSaveSegment = async () => {
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label })),
    };

    // Send data to webhook URL
    const webhookUrl = 'YOUR_WEBHOOK_URL_HERE'; // Replace with your webhook URL from https://webhook.site
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      alert('Segment saved successfully!');
    } catch (error) {
      console.error('Error saving segment:', error);
    }

    // Close the popup
    setIsPopupOpen(false);
    setIsButtonVisible(true)
  };

  return (
    <div className="App">
{isButtonVisible && <button onClick={handleSaveSegmentClick}>Save Segment</button>}

      {isPopupOpen && (
        <div className="popup">
          <h2>Save Segment</h2>
          <label>
            Segment Name:
            <input
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
          </label>

          <div className="schema-dropdowns">
            {selectedSchemas.map((schema, index) => (
              <select key={index} value={schema.value} disabled>
                <option value={schema.value}>{schema.label}</option>
              </select>
            ))}

            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Add schema to segment</option>
              {availableOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button onClick={handleAddNewSchema}>+ Add new schema</button>
          </div>

          <button onClick={handleSaveSegment}>Save the Segment</button>
        </div>
      )}
    </div>
  );
}

export default App;
