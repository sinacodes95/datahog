import Bull from "bull";
type JobsParam = Bull.Job|undefined|null|void;
type ExtractedIds = Bull.JobId;

export const extractJobIds = (jobs: JobsParam): ExtractedIds => {
    if (jobs) {
        return jobs.id;
    }
    return '';
}
