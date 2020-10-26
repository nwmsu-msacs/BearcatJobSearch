"use strict";

const _ = use("lodash");
const Hash = use("Hash");
const Student = use("App/Models/Student");
const Job = use("App/Models/Job");
const StudentApplication = use("App/Models/StudentApplication");

class StudentApplicationController {
  async StudentApplyJob({ request, auth, response, params }) {
    console.log(params.studentId, params.jobId);
    const job = await Job.find(params.jobId);
    const student = await Student.find(params.studentId);

    await student.studentApplications().detach().where("jobId", params.jobId);

    await student.studentApplications().attach([job.id], (studentApplication) => {
      studentApplication.status = "Applied";
    });

    return "Student Applied";
  }

  async getStudentAppliedJobs({ request, auth, response, params }) {
    console.log(params.studentId);
    const appliedJobs = await Job.query()
      .with("jobApplications", (builder) => {
        builder
          // .where("student_applications.status", "Applied")
          .where("student_applications.studentId", params.studentId);
      })
      .fetch();

    return appliedJobs;
  }
  async getStudentAppliedJobsSearch({ request, auth, response, params }) {
    console.log(params.studentId);
    console.log(params.search);
    const appliedJobs = await Job.query()
      .where("jobTitle", "like", "%" + params.search + "%")
      .orWhere("jobDescription", "like", "%" + params.search + "%")
      .with("jobApplications", (builder) => {
        builder
          .where("student_applications.status", "Applied")
          .where("student_applications.studentId", params.studentId);
      })
      .fetch();

    return appliedJobs;
  }

  async StudentGotRejected({ request, auth, response, params }) {
    try {
      console.log(params.studentId, params.jobId, params.status);
      const job = await Job.find(params.jobId);
      const student = await Student.find(params.studentId);

      await student.studentApplications().detach().where("jobId", params.jobId);

      await student
        .studentApplications()
        .attach([job.id], (studentApplication) => {
          studentApplication.status = params.status;
        });
    } catch (err) {
      console.log(err);
    }

    return "Student Applied";
  }

  async StudentGotApproved({ request, auth, response, params }) {
    console.log(params.studentId, params.jobId);
    const job = await Job.find(params.jobId);
    const student = await Student.find(params.studentId);
    student.studentApplications().detach(student.id, job.id);
    student.studentApplications().attach([job.id], (studentApplication) => {
      studentApplication.status = "Approved";
    });

    return "Student Approved";
  }

  async getAppliedStudentForJob({ auth, response, params }) {
    try {
      console.log("appliedJobs:");
      const appliedJobs = await Job.query()
        .where("id", params.jobId)
        .with("jobApplications")
        .fetch();

      return response.ok(appliedJobs);
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = StudentApplicationController;
