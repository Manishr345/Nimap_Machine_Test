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
    select p.id as productid, p.name as productname, p.categoryid, c.name as categoryname from products p left join categories c on p.categoryid = c.id limit plimit offset poffset;
end &&
delimiter ;


delimiter &&
create procedure insertProduct(
    in productName varchar(50),
    in category_id int
)
begin
    insert into products (name, categoryid) values (productName, category_id);
end &&
delimiter ;

delimiter &&
create procedure updateProduct(
    in productId int,
    in productName varchar(50),
    in category_id int
)
begin
    update products set name = productName, categoryid = category_id where id = productId;
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

delimiter &&
create procedure getAllCategories()
begin
    select id as categoryid, name as categoryname from categories;
end &&
delimiter ;

delimiter &&
create procedure insertCategory(
    in categoryName varchar(50)
)
begin
    insert into categories (name) values (categoryName);
end &&
delimiter ;

delimiter &&
create procedure updateCategory(
    in categoryId int,
    in categoryName varchar(50)
)
begin
    update categories set name = categoryName where id = categoryId;
end &&
delimiter ;

delimiter &&
create procedure deleteCategory(
    in category_id int
)
begin
	delete from products where categoryid = category_id;
    delete from categories where id = category_id;
end &&
delimiter ;