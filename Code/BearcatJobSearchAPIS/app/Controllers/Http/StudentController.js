"use strict";

const _ = use("lodash");
const Hash = use("Hash");
const Student = use("App/Models/Student");
const Job = use("App/Models/Job")

class StudentController {
    async getStudentBasedOnId({ request, auth, response,params }) {
        // console.log(params.studentId)
        const student = await Student.find(params.studentId)
        // console.log(student)
        return response.status(200).json(student);
    }

    async getAllJobs({request, auth, response, params}) {
        const job = await Job.all();
        console.log(job)
        return response.status(200).json(job);

    }

    async getJobBasedOnId({ request, auth, response,params }) {
        //console.log(params.jobId)
        const job = await Job.find(params.jobId);
        //console.log(job)
        return response.status(200).json(job);
    }

    async searchStudent({ params, request, response }) {

        const queryParam = request.all();
        let students;
        
        if (queryParam && queryParam.search) {
            students = await Student.query()
                .where(function () {
                    this.where('StudentName', 'like', '%' + queryParam.search + '%')
                        .orWhere('StudentId', 'like', '%' + queryParam.search + '%')
                })
                .fetch();
        } else {
             students = await Student.all();
        }

        return response.ok(students);
    }

}
module.exports = StudentController;