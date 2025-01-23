import connection from "../db_connection.js"

function index(req, res) {
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

function show(req, res) {
    const id = parseInt(req.params.id)
    const sql = ("SELECT * FROM movies WHERE id = ?")
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({
            error: "Database quesy failed!"
        })
        if (results[0]) {
            console.log(results[0]);
            return res.json(results[0]);
        } else {
            return res.status(500).json({ error: "Movie is not found!" })
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
