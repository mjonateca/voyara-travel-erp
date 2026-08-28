-- Give the demo users visible personal work queues.
with demo_assignments(task_title, display_name, due_offset, priority) as (
  values
    ('Confirm transport voucher', 'ADRIAN', interval '1 day', 'HIGH'),
    ('Reconfirm hotel allotment', 'DARLENYS', interval '2 days', 'NORMAL'),
    ('Collect pending payment', 'MANUEL', interval '3 days', 'HIGH')
)
insert into public.operations_tasks (tenant_id, title, due_at, status, priority, assigned_to)
select profile.tenant_id, assignment.task_title, now() + assignment.due_offset, 'OPEN', assignment.priority, profile.id
from demo_assignments assignment
join public.profiles profile on upper(profile.display_name) = assignment.display_name
where not exists (
  select 1 from public.operations_tasks existing
  where existing.tenant_id = profile.tenant_id and existing.title = assignment.task_title
);

with demo_assignments(task_title, display_name) as (
  values ('Confirm transport voucher', 'ADRIAN'), ('Reconfirm hotel allotment', 'DARLENYS'), ('Collect pending payment', 'MANUEL')
)
update public.operations_tasks task set assigned_to = profile.id
from demo_assignments assignment join public.profiles profile on upper(profile.display_name) = assignment.display_name
where task.title = assignment.task_title and task.tenant_id = profile.tenant_id;
