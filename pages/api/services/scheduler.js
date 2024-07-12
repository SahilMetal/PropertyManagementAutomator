import postCharge from "./utils/postCharge"
import cron from 'node-cron';

export default async function POST(req, res) {
    try {
        cron.schedule(" 0 * * * * ", async () => {
            console.log("");
            console.log("######################################");
            console.log("#                                    #");
            console.log("# Running scheduler every 1 hour     #");
            console.log("#                                    #");
            console.log("######################################");
            console.log("");

            await postCharge();
        });
        res.status(200).json({ message: "Successfully posted!" });
    } catch (error) {
        res.status(500).json({ message: 'Error found here: ', error})
    }
}