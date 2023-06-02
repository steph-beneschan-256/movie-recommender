export default function Recommendations({loading, imgBasePath, films}) {
    return (
    <div className="recommendations">
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