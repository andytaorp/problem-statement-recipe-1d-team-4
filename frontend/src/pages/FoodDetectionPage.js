import React, { useState } from 'react';
import './FoodDetectionPage.css';

const FoodAnalysis = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const headers = { Authorization: `Bearer ${process.env.REACT_APP_API_USER_TOKEN}` };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select an image first.');

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            const segmentationResponse = await fetch(
                'https://api.logmeal.com/v2/image/segmentation/complete',
                { method: 'POST', body: formData, headers }
            );
            const segmentationData = await segmentationResponse.json();
            console.log("Segmentation Response:", segmentationData);

            if (!segmentationData.imageId) throw new Error('Segmentation failed');

            const nutritionResponse = await fetch(
                'https://api.logmeal.com/v2/recipe/nutritionalInfo',
                {
                    method: 'POST',
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageId: segmentationData.imageId }),
                }
            );
            const nutritionData = await nutritionResponse.json();
            console.log("Nutritional Response:", nutritionData);

            setResult(nutritionData);
        } catch (error) {
            console.error('Error:', error);
            setResult({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const keyNutrients = {
        ENERC_KCAL: "Energy",
        CHOCDF: "Carbs",
        PROCNT: "Protein",
        FAT: "Fat",
        FASAT: "Saturated Fats",
        SUGAR: "Sugars",
        NA: "Sodium"
    };

    return (
        <div className="analysis-container">
            <form onSubmit={handleSubmit} className="upload-form">
                <h3>Upload a Food Image</h3>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Analyze'}
                </button>
            </form>

            {result && (
                <div className="nutrition-details">
                    <h4>Nutritional Information</h4>
                    {result.error ? (
                        <p className="error-message">{result.error}</p>
                    ) : result.nutritional_info ? (
                        <>
                            <p><strong>Total Calories:</strong> {result.nutritional_info?.calories?.toFixed(2)} kcal</p>
                            <ul>
                                {Object.entries(keyNutrients).map(([key, label]) => {
                                    const nutrients = result.nutritional_info?.totalNutrients;
                                    const nutrientValue = nutrients?.[key]?.quantity;

                                    return nutrientValue !== undefined ? (
                                        <li key={key}>
                                            <strong>{label}:</strong> {nutrientValue.toFixed(2)} {nutrients[key].unit}
                                        </li>
                                    ) : (
                                        <li key={key}><strong>{label}:</strong> N/A</li>
                                    );
                                })}
                            </ul>
                        </>
                    ) : (
                        <p className="error-message">No nutritional data available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FoodAnalysis;


// Backup code lol
// import React, { useState } from 'react';
// import './FoodDetectionPage.css';

// const Analysis = () => {
//     const [file, setFile] = useState(null);
//     const [result, setResult] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const headers = { Authorization: `Bearer ${process.env.REACT_APP_API_USER_TOKEN}` };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!file) return alert('Please select an image first.');

//         const formData = new FormData();
//         formData.append('image', file);

//         setLoading(true);
//         try {
//             const segmentationResponse = await fetch(
//                 'https://api.logmeal.com/v2/image/segmentation/complete',
//                 { method: 'POST', body: formData, headers }
//             );
//             const segmentationData = await segmentationResponse.json();
//             console.log("Segmentation Response:", segmentationData);

//             if (!segmentationData.imageId) throw new Error('Segmentation failed');

//             const nutritionResponse = await fetch(
//                 'https://api.logmeal.com/v2/recipe/nutritionalInfo',
//                 {
//                     method: 'POST',
//                     headers: { ...headers, 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ imageId: segmentationData.imageId }),
//                 }
//             );
//             const nutritionData = await nutritionResponse.json();
//             console.log("Nutritional Response:", nutritionData);

//             setResult(nutritionData);
//         } catch (error) {
//             console.error('Error:', error);
//             setResult({ error: error.message });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const keyNutrients = {
//         ENERC_KCAL: "Energy",
//         CHOCDF: "Carbs",
//         PROCNT: "Protein",
//         FAT: "Fat",
//         FASAT: "Saturated fats",
//         SUGAR: "Sugars",
//         NA: "Sodium"
//     };

//     return (
//         <div className="pages">
//             <form onSubmit={handleSubmit} className="signup">
//                 <h3>Upload a Photo</h3>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setFile(e.target.files[0])}
//                 />
//                 <button type="submit" disabled={loading}>
//                     {loading ? 'Uploading...' : 'Upload'}
//                 </button>
//             </form>

//             {result && (
//                 <div className="workout-details">
//                     <h4>Nutritional Information</h4>
//                     {result.error ? (
//                         <p className="error">{result.error}</p>
//                     ) : result.nutritional_info ? (
//                         <>
//                             <p><strong>Total Calories:</strong> {result.nutritional_info?.calories?.toFixed(2)} kcal</p>

//                             <ul>
//                                 {Object.entries(keyNutrients).map(([key, label]) => {
//                                     const nutrients = result.nutritional_info?.totalNutrients;
//                                     const nutrientValue = nutrients?.[key]?.quantity;

//                                     return nutrientValue !== undefined ? (
//                                         <li key={key}>
//                                             <strong>{label}:</strong> {nutrientValue.toFixed(2)} {nutrients[key].unit}
//                                         </li>
//                                     ) : (
//                                         <li key={key}><strong>{label}:</strong> N/A</li>
//                                     );
//                                 })}
//                             </ul>
//                         </>
//                     ) : (
//                         <p className="error">No nutritional data available.</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Analysis;

