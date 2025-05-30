﻿using Microsoft.EntityFrameworkCore;
using WorthBoards.Data.Identity;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Database
{
    public static class Linker
    {
        public static void LinkAll(ModelBuilder modelBuilder)
        {
            AddDateGeneration(modelBuilder);
            LinkEntities(modelBuilder);
        }

        public static void AddDateGeneration(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Board>()
                .Property(b => b.CreationDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<BoardOnUser>()
                .Property(b => b.AddedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<BoardTask>()
                .Property(b => b.CreationDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Comment>()
                .Property(b => b.CreationDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Notification>()
                .Property(b => b.SendDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<TaskOnUser>()
                .Property(b => b.AssignedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }

        public static void LinkEntities(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApplicationUser>()
                .HasMany<BoardOnUser>()
                .WithOne()
                .HasForeignKey(b => b.UserId)
                .IsRequired();

            modelBuilder.Entity<ApplicationUser>()
                .HasMany<TaskOnUser>()
                .WithOne()
                .HasForeignKey(b => b.UserId)
                .IsRequired();

            modelBuilder.Entity<ApplicationUser>()
                .HasMany<NotificationOnUser>()
                .WithOne()
                .HasForeignKey(b => b.UserId)
                .IsRequired();

            modelBuilder.Entity<ApplicationUser>()
                .HasMany<Notification>()
                .WithOne()
                .HasForeignKey(b => b.SenderId)
                .IsRequired();

            modelBuilder.Entity<ApplicationUser>()
                .HasMany<Comment>()
                .WithOne()
                .HasForeignKey(b => b.UserId)
                .IsRequired();

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.BoardTask)
                .WithMany(bt => bt.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BoardTask>()
                .HasMany(b => b.Comments)
                .WithOne(c => c.BoardTask) 
                .IsRequired();

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Task)
                .WithMany()
                .HasForeignKey(n => n.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Board)
                .WithMany()
                .HasForeignKey(n => n.BoardId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}