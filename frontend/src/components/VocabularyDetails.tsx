import { useParams } from 'react-router-dom';

const VocabularyDetails = () => {
  const { id } = useParams();

  return (
    <div className="details-card">
      <h1>Vocabulary Detail</h1>
      <p>Word ID: {id}</p>
      <p>This page is optional in search-based flow.</p>
    </div>
  );
};

export default VocabularyDetails;