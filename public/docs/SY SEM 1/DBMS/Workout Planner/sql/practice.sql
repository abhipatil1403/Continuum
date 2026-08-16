--LEFT JOIN:
select column_name
from tableA
left join tableB
on tableA.user_id = tableB.user_id;

--GROUP BY:
group by tableA.user_id, tableB.user_name

--COUNT:
having count(tableB.user_age)>10

--ORDER BY:
order by tableA.user_age desc

--COALESCE
coalesce(sum(tr.sets*tr.reps), 0) as total_reps