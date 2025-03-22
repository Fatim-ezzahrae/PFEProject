const CreatedJobOffers = () => {
    const jobOffers = [
      { id: 1, title: "Frontend Developer", company: "Tech Corp" },
    ];
  
    return (
      <div>
        <h2>Created Job Offers</h2>
        {jobOffers.length > 0 ? (
          <ul>
            {jobOffers.map((offer) => (
              <li key={offer.id}>{offer.title} at {offer.company}</li>
            ))}
          </ul>
        ) : (
          <p>You haven't created any job offers yet.</p>
        )}
      </div>
    );
  };
  
  export default CreatedJobOffers;
  