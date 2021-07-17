import Bull from "bull";
type JobsParam = Bull.Job|Bull.Job[]|undefined|null|void;
type ExtractedIds = Bull.JobId|Bull.JobId[];

export const extractJobIds = (jobs: JobsParam): ExtractedIds => {
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
    return '';
}
