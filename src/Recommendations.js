export default function Recommendations({films}) {
    return (
    <div>
        {films.map((film) => { return (
            <div>
                <h4>{film.title}</h4>
            </div>
        )

        })}
    </div>
    )
}