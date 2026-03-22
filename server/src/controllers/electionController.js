const fs = require('fs');
const path = require('path');

const getElections = (req, res) => {
    try {
        const DATA_PATH = path.join(__dirname, '../data/elections.json');

        if (!fs.existsSync(DATA_PATH)) {
            return res.status(404).json({
                success: false,
                message: `Elections data not found.`
            });
        }

        const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
        const electionsData = JSON.parse(rawData);

        return res.status(200).json({
            success: true,
            data: electionsData.elections
        });

    } catch (error) {
        console.error("Error fetching elections:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

module.exports = {
    getElections
};
