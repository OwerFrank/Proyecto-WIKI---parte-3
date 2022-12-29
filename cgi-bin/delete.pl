#!/usr/bin/perl -w
use strict;
use warnings;
use CGI;
use DBI;

#Recibe los párametros del formulario
my $q = CGI->new;
my $owner = $q->param('owner');
my $title = $q->param('title');

print $q->header('text/xml');
print "<?xml version='1.0' encoding='utf-8'?>\n";

if(validarDelete($title,$owner)){
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
      
  my $sth = $dbh->prepare("DELETE FROM Articles WHERE title=? AND owner=?");
  $sth->execute($title,$owner);
  print "<article>\n";
  print "<owner>$owner</owner>\n";
  print "<title>$title</title>\n";
  print "</article>\n";
                
  $sth->finish;
  $dbh->disconnect;
}else{
  print "<article>\n</article>\n";
}

sub validarDelete{
  my $title = $_[0];
  my $owner = $_[1];
  
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
          
  my $sth = $dbh->prepare("SELECT * FROM Articles WHERE title=? AND owner=?");
  $sth->execute($title,$owner);
  my @row = $sth->fetchrow_array;
  $sth->finish;
  $dbh->disconnect;
  return @row;
}
