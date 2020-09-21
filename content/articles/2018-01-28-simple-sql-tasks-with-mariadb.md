---
layout: post
title: How to do simple SQL tasks with MariaDB
date: 2018-01-28
comments: true
image: /static/mariadb.png
permalink: /2018/01/28/how-to-do-simple-sql-tasks-with-mariadb-0
---

In this article I'll look at another interview takehome assignment. This assignment included SQL, python and some logic puzzles. If you read to the end I'll share a fun "trick question" that was also included.

I mostly want to talk about the SQL portion of the test. Since I mostly work with postgresql through the Django ORM, this was a good refresher. I'll show how I approached some simple SQL tasks, and how to use MariaDB.

> **MariaDB** is the default implementation of MySQL in Arch Linux, provided with the mariadb package.

## The Task

Here are the three questions I was asked:

Please reference the 3 tables below.

1. Using SQL please write the code to generate a table that includes all individuals on the file and contains the following fields: ID, Congressional District, and Gender

2. Using SQL please write the code to generate a table that includes only individuals with a gender on file that have a DistrictID of 3. Also please convert the values for Gender from “M” and “F” to “Male” and “Female” respectively. Your final table should include only ID and the converted Gender.

3. Using SQL please generate the code to run a count of gender by Congressional District.

![png](/static/sql.png)

- ID is a unique ID that is applied to each individual on file
- DistrictID is a unique ID that is applied to each district on file
- Gender is a value that is recorded on some records on file

### Install MySQL/MariaDB

First, we need to install MariaDB. As usual, just [follow the Arch Wiki](https://wiki.archlinux.org/index.php/MySQL).

### Run mysql

Next, we can run `mysql` in the terminal:

```
 $ mysql
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 18
Server version: 10.1.30-MariaDB MariaDB Server

Copyright (c) 2000, 2017, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

### Create _and set_ a database to use

The next step is to create a database. We can do the following:

```
MariaDB [(none)]> create database sample_db default character set utf8 default collate utf8_bin;
ERROR 1044 (42000): Access denied for user ''@'localhost' to database 'sample_db'
MariaDB [(none)]> Ctrl-C -- exit!
Aborted
```

If you see this error, it is because we aren't using the correct user for SQL. We can use the default root user with no password instead. So here we will rerun the `mysql` command with additional arguments:

```
 $ mysql -u root
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 19
Server version: 10.1.30-MariaDB MariaDB Server

Copyright (c) 2000, 2017, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> create database sample_db default character set utf8 default collate utf8_bin;
Query OK, 1 row affected (0.01 sec)

MariaDB [(none)]> use sample_db
Database changed
MariaDB [sample_db]>
```

Great, no we are using the blank database called `sample_db` and we are using it, notice that `[sample_db]>` has repaced `[(none)]>` in the MariaDB prompt.

### Create tables and insert data into the tables

Now we are read to get going with our questions. Before we write our queries, we need to get the data from the question into our database. To do this I wrote `insert.sql` and ran it in MariaDB. Here is the script:

```
CREATE TABLE table_A (
  ID int,
  District_ID int
  );

CREATE TABLE table_B (
  District_ID int,
  Congressional_District int
  );

CREATE TABLE table_C (
  ID int,
  Gender CHAR(1)
  );

INSERT INTO table_A (ID, District_ID) VALUES ('1', '3');
INSERT INTO table_A (ID, District_ID) VALUES ('2', '3');
INSERT INTO table_A (ID, District_ID) VALUES ('3', '4');
INSERT INTO table_A (ID, District_ID) VALUES ('4', '4');
INSERT INTO table_A (ID, District_ID) VALUES ('5', '3');
INSERT INTO table_A (ID, District_ID) VALUES ('6', '4');
INSERT INTO table_A (ID, District_ID) VALUES ('7', '4');
INSERT INTO table_A (ID, District_ID) VALUES ('8', '3');
INSERT INTO table_A (ID, District_ID) VALUES ('9', '4');
INSERT INTO table_A (ID, District_ID) VALUES ('10', '3');

INSERT INTO table_B (District_ID, Congressional_District) VALUES ('1', '8');
INSERT INTO table_B (District_ID, Congressional_District) VALUES ('2', '2');
INSERT INTO table_B (District_ID, Congressional_District) VALUES ('3', '14');
INSERT INTO table_B (District_ID, Congressional_District) VALUES ('4', '7');
INSERT INTO table_B (District_ID, Congressional_District) VALUES ('5', '11');

INSERT INTO table_C (ID, Gender) VALUES ('1', 'M');
INSERT INTO table_C (ID, Gender) VALUES ('3', 'F');
INSERT INTO table_C (ID, Gender) VALUES ('4', 'M');
INSERT INTO table_C (ID, Gender) VALUES ('5', 'F');
INSERT INTO table_C (ID, Gender) VALUES ('6', 'F');
INSERT INTO table_C (ID, Gender) VALUES ('7', 'F');
INSERT INTO table_C (ID, Gender) VALUES ('8', 'M');
INSERT INTO table_C (ID, Gender) VALUES ('9', 'F');
INSERT INTO table_C (ID, Gender) VALUES ('10', 'M');
```

Now we can run the script with the following command:

```
MariaDB [sample_db]> source my_sql_script.sql
Query OK, 0 rows affected (0.08 sec)

Query OK, 0 rows affected (0.07 sec)

Query OK, 0 rows affected (0.06 sec)

Query OK, 1 row affected (0.02 sec)

Query OK, 1 row affected (0.00 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.03 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.00 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.02 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

Query OK, 1 row affected (0.01 sec)

MariaDB [sample_db]>
```

Great, now let's test it out with a simple `select * from table_name` command:

```
MariaDB [sample_db]> select * from table_A;
+------+-------------+
| ID   | District_ID |
+------+-------------+
|    1 |           3 |
|    2 |           3 |
|    3 |           4 |
|    4 |           4 |
|    5 |           3 |
|    6 |           4 |
|    7 |           4 |
|    8 |           3 |
|    9 |           4 |
|   10 |           3 |
+------+-------------+
10 rows in set (0.00 sec)
```

This matches what we were given, so now let's move on to the first task, creating one table from the three we are given.

#### 1

Using SQL please write the code to generate a table that includes all individuals on the file and contains the following fields: ID, Congressional District, and Gender

```sql
select table_A.ID, Congressional_District, Gender
from table_A
  left join table_B
    on table_A.District_ID = table_B.District_ID
  left join table_C
    on table_A.ID = table_C.ID order by ID;
```

```
+------+------------------------+--------+
| ID   | Congressional_District | Gender |
+------+------------------------+--------+
|    1 |                     14 | M      |
|    2 |                     14 | NULL   |
|    3 |                      7 | F      |
|    4 |                      7 | M      |
|    5 |                     14 | F      |
|    6 |                      7 | F      |
|    7 |                      7 | F      |
|    8 |                     14 | M      |
|    9 |                      7 | F      |
|   10 |                     14 | M      |
+------+------------------------+--------+
10 rows in set (0.00 sec)
```

#### 2

Using SQL please write the code to generate a table that includes only individuals with a gender on file that have a DistrictID of 3. Also please convert the values for Gender from “M” and “F” to “Male” and “Female” respectively. Your final table should include only ID and the converted Gender.

```sql
select
  table_A.ID,
  case
    when Gender = "M" then "Male"
    when Gender = "F" then "Female"
  end as Gender
from table_A
  left join table_B
    on table_A.District_ID = table_B.District_ID
  left join table_C on table_A.ID = table_C.ID
where table_A.District_ID = 3 and table_C.Gender is not null
order by ID;
```

```
+------+--------+
| ID   | Gender |
+------+--------+
|    1 | Male   |
|    5 | Female |
|    8 | Male   |
|   10 | Male   |
+------+--------+
4 rows in set (0.00 sec)
```

#### 3

Using SQL please generate the code to run a count of gender by Congressional District.

```sql
select
  count(table_C.Gender) Count,
  Congressional_District,
  Gender
from table_A
  left join table_B
    on table_A.District_ID = table_B.District_ID
  left join table_C
    on table_A.ID = table_C.ID
group by Congressional_District, Gender;
```

```
+-------+------------------------+--------+
| Count | Congressional_District | Gender |
+-------+------------------------+--------+
|     4 |                      7 | F      |
|     1 |                      7 | M      |
|     0 |                     14 | NULL   |
|     1 |                     14 | F      |
|     3 |                     14 | M      |
+-------+------------------------+--------+
5 rows in set (0.00 sec)
```

That's it for the three SQL tasks. Here's the bonus question:

> Assume there are 6,000,000,000 (6 billion) people on Earth. What would you estimate to be the result, if you multiply together the number of fingers on every person's left-hands? (For the purposes of this exercise, thumbs count as fingers.)

Think about it for a minute. I have hidden my answer at the end of the URL for this article.
