let factorNames = ["Communal", "Aesthetic", "Dark", "Thrilling", "Cerebral"];

const FACTOR_DESCRIPTIONS = {
    Communal: "Films in this category are often lighthearted, and focused on people and relationships. This includes most movies in the drama and romance genres, as well as a lot of comedies.",
    Aesthetic: "Films in this category tend to be more abstract, experimental, or complicated than other films. This includes a lot of musicals and historical fiction movies, as well as documentaries.",
    Dark: "Films in this category evoke intense feelings of fear or discomfort; the category is mostly synonymous with the horror genre.",
    Thrilling: "Thrilling films involve elements of action, adventure, suspense, and/or fantasy. This includes the thriller genre but also science-fiction, fantasy, westerns, and more.",
    Cerebral: "Cerebral films present factual information about a given topic: that is, documentaries; nonfiction."

};

export default function Recommendations({preferredFactor, films, loading, imgBasePath}) {
    return (
    <div className="recommendations">
        <h3>
            Predicted film preference: {preferredFactor}
        </h3>
        <p>
            {FACTOR_DESCRIPTIONS[preferredFactor]}
            <br/>
            
        </p>

        {
            (loading) ? (
                <h2>Loading Recommendations...</h2>
            )
            : (
                <>
                    <h2>Recommended Movies For You:</h2>
                    <div className="recommendationsContainer">
                        {films.map((film) => { return (
                            <div className="filmRecommendation">
                                <a href={"https://www.themoviedb.org/movie/" + film.id.toString()}
                                target="_blank" rel="noreferrer">
                                    <img src={imgBasePath + film.poster_path} alt=""
                                    className="filmThumbnail"/>
                                </a>


                                <a href={"https://www.themoviedb.org/movie/" + film.id.toString()}
                                target="_blank" rel="noreferrer">
                                    <h4>{film.title} ({new Date(film.release_date).getFullYear()})</h4>
                                </a>
                            </div>
                        )
                        })}
                    </div>
                </>     
            )
        }
        
    </div>
    )
}