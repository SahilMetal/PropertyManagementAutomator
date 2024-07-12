import handleEmporiaToDoorloopCharges from "./utils/handleEmporiaToDoorloopCharges"
import cron from 'node-cron';

export default async function POST(_, res) {
    try {
        cron.schedule(process.env.CRON_SCHEDULER, async () => {
            console.log("");
            console.log("######################################");
            console.log("#                                    #");
            console.log("# Running scheduler                  #");
            console.log("#                                    #");
            console.log("######################################");
            console.log("");

            await handleEmporiaToDoorloopCharges();
        });
        res.status(200).json({ message: "Successfully posted!" });
    } catch (error) {
        res.status(500).json({ message: 'Error found here: ', error})
    }
}