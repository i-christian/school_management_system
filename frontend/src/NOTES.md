# New proposed changes


The grades dashboard will have a list a students with columns responsible for the headteacher and class teacher remarks. Here is how this will be implemented
 - a function call via for all students listed from the server.
 - Then update each student remarks fields using the student update function which will expose only those two fields.
 - All this is necessary because of the students model has been changed in the backend to have optional classteacher and headteacher remarks like this:
```
export type StudentCreate = {
    first_name: string;
    middle_name: (string | null);
    last_name: string;
    contact: (string | null);
    form_id: string;
    fees?: number;
    class_teacher_remark: (string | null);
    head_teacher_remark: (string | null);
};

export type StudentPublic = {
    first_name: string;
    middle_name: (string | null);
    last_name: string;
    contact: (string | null);
    form_id: string;
    fees?: number;
    class_teacher_remark: (string | null);
    head_teacher_remark: (string | null);
    id: string;
    owner_id: string;
};

export type StudentUpdate = {
    first_name?: string;
    middle_name: (string | null);
    last_name?: string;
    contact: (string | null);
    form_id?: string;
    fees?: number;
    class_teacher_remark: (string | null);
    head_teacher_remark: (string | null);
};

export type StudentsPublic = {
    data: Array<StudentPublic>;
    count: number;
};

```


Another change for the grades input, just a field associated with a remark from each teacher. This change will be in the Teachers dashboard on My Students:
 - This is because the grades types have been changed in the backend to add an optional remarks section like this: 
```
  export type GradeCreate = {
    student_id: string;
    subject_id: string;
    score: number;
    remark: (string | null);
};

export type GradePublic = {
    student_id: string;
    subject_id: string;
    score: number;
    remark: (string | null);
    id: string;
};

export type GradeUpdate = {
    student_id: string;
    subject_id: string;
    score?: number;
    remark?: (string | null);
};

export type GradesPublic = {
    data: Array<GradePublic>;
    count: number;
};

```
