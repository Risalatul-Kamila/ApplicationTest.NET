using Microsoft.EntityFrameworkCore;

namespace Pelindo.API.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Biodata> Biodatas { get; set; }
        public DbSet<Pendidikan> Pendidikans { get; set; }
        public DbSet<Pelatihan> Pelatihans { get; set; }
        public DbSet<Pekerjaan> Pekerjaans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Biodata>()
                .HasOne(b => b.User)
                .WithOne(u => u.Biodata)
                .HasForeignKey<Biodata>(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Biodata>()
                .HasMany(b => b.Pendidikan)
                .WithOne(p => p.Biodata)
                .HasForeignKey(p => p.BiodataId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Biodata>()
                .HasMany(b => b.Pelatihan)
                .WithOne(p => p.Biodata)
                .HasForeignKey(p => p.BiodataId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Biodata>()
                .HasMany(b => b.Pekerjaan)
                .WithOne(p => p.Biodata)
                .HasForeignKey(p => p.BiodataId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
