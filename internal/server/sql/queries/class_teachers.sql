-- name: GetAllDBClassTeachers :many
select
    u.user_id as teacher_id,
    u.first_name,
    u.last_name,
    r.name as role
from users u
join roles r on u.role_id = r.role_id
and r.name = 'classteacher'
order by u.last_name;

-- name: UpSertClassTeacher :one
insert into class_teachers (teacher_id, class_id)
    values ($1, $2)
    on conflict (teacher_id, class_id)
do update
    set
        teacher_id = excluded.teacher_id,
        class_id = excluded.class_id 
returning id;

-- name: ListCLassTeachers :many
select
    ct.id,
    u.first_name,
    u.last_name,
    c.class_id,
    c.name as class
from class_teachers ct
join users u on ct.teacher_id = u.user_id
join classes c on ct.class_id = c.class_id
order by c.name;

-- name: GetClassTeacher :one
select
    ct.id,
    u.first_name,
    u.last_name,
    c.class_id,
    c.name as class
from class_teachers ct
join users u on ct.teacher_id = u.user_id
join classes c on ct.class_id = c.class_id
where c.class_id = $1;

-- name: RemoveClassTeacher :exec
WITH updated_user AS (
    select
        roles.name,
        roles.role_id,
        case when roles.name <> 'classteacher'
            then users.user_id
        end user_id
    from roles
    join users using (role_id)
    where users.user_id = $1
)
delete
    from class_teachers
where teacher_id = (select user_id from updated_user);
