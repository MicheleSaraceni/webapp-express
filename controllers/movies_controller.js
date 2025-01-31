import connection from "../db_connection.js"

function index(req, res) {
    //Salvo la Query nella const sql
    const sql = ("SELECT * FROM movies")

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({
            error: "Database quesy failed!"
        })
        console.log(results);
        res.json({
            lenght: results.length,
            items: results
        });
    })
}

const show = (req, res) => {
    const id = parseInt(req.params.id)
    const sql = `SELECT movies.*, AVG(reviews.vote) AS vote_avarage FROM movies
    JOIN reviews ON movies.id = reviews.movie_id
    WHERE movies.id = ?`
    connection.query(sql, [id], (err, results) => {

        if (err)
            return res.status(500).json({ error: err })

        if (!results[0])
            return res.status(404).json({ error: "element not found" })

        if (results[0]) {
            const sql2 = `SELECT reviews.* FROM reviews
            WHERE movie_id = ?`;
            const item = results[0]
            connection.query(sql2, [id], (err, results2) => {

                if (err)
                    return res.status(500).json({ error: err })

                item.reviews = results2
                return res.json({ item: item, reviews: item.reviews })

            })
        }

    })

}

function destroy(req, res) {
    const id = parseInt(req.params.id)
    const sql = ("DELETE FROM movies WHERE id = ?")
    connection.query(sql, [id], (err) => {
        if (err) return (
            res.status(500),
            console.log("Movie is not found!")
        )
        return (
            res.status(204),
            console.log(`Movie (id:${id}) is removed!`)
        )
    })
}

export { index, show, destroy }
