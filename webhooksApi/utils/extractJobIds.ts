import Bull from "bull";

export const extractJobIds = (jobs: Bull.Job|Bull.Job[]|undefined|null):Bull.JobId|Bull.JobId[] => {
    if (jobs) {
        if (Array.isArray(jobs)) {
            const idsList = [];
            for (const job of jobs) {
                idsList.push(job.id);
            }
            return idsList;
        }
        return jobs.id;
    }
    return [];
}
