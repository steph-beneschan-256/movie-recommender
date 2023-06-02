export default function Recommendations({imgBasePath, films}) {
    return (
    <div>
        {films.map((film) => { return (
            <div className="filmRecommendation">
                <img src={imgBasePath + film.poster_path} alt=""
                    className="filmThumbnail"/>

                <a href={"https://www.themoviedb.org/movie/" + film.id.toString()}
                target="_blank" rel="noreferrer">
                    <h4>{film.title}</h4>
                </a>
            </div>
        )

        })}
    </div>
    )
}