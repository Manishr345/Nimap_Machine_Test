use nimap;

create table categories(id int primary key auto_increment, name varchar(50) not null);

create table products(id int primary key auto_increment, name varchar(50) not null, categoryid int, foreign key(categoryid) references categories(id));

insert into categories(name) values("Electronics"), ("Tupper Ware"), ("Toys"), ("Clothing"), ("Furniture");

select * from categories;

load data infile "C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/products.csv" into table products fields terminated by ',' lines terminated by '\n' ignore 1 rows (name, categoryid);

select * from products;


delimiter &&
create procedure getAllProducts(
    in plimit int,
    in poffset int
)
begin
    select p.id as productid, p.name as productname, p.categoryid, c.name as categoryname
    from products p
    left join categories c on p.categoryid = c.id
    limit plimit offset poffset;
end &&
delimiter ;


delimiter &&
create procedure insertProduct(
    in productName varchar(50),
    in categoryId int
)
begin
    insert into products (name, categoryid)
    values (productName, categoryId);
end &&
delimiter ;

delimiter &&
create procedure updateProduct(
    in productId int,
    in productName varchar(50),
    in categoryId int
)
begin
    update products
    set name = productName,
        categoryid = categoryId
    where id = productId;
end &&
delimiter ;

delimiter &&
create procedure deleteProduct(
    in productId int
)
begin
    delete from products where id = productId;
end &&
delimiter ;