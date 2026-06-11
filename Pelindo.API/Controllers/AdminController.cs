using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pelindo.API.Models;

namespace Pelindo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("biodata")]
        public async Task<IActionResult> GetAllBiodata([FromQuery] string search = "")
        {
            var query = _context.Biodatas
                .Include(b => b.User)
                .Include(b => b.Pendidikan)
                .Include(b => b.Pelatihan)
                .Include(b => b.Pekerjaan)
                .Where(b => b.User.Role == "USER")
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b =>
                    b.Nama.Contains(search) ||
                    b.PosisiYangDilamar.Contains(search) ||
                    b.Pendidikan.Any(p => p.Jenjang.Contains(search))
                );
            }

            var result = await query.ToListAsync();
            return Ok(result);
        }

        [HttpGet("biodata/{id}")]
        public async Task<IActionResult> GetBiodataById(int id)
        {
            var biodata = await _context.Biodatas
                .Include(b => b.Pendidikan)
                .Include(b => b.Pelatihan)
                .Include(b => b.Pekerjaan)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (biodata == null) return NotFound();
            return Ok(biodata);
        }

        [HttpPut("biodata/{id}")]
        public async Task<IActionResult> UpdateBiodataById(int id, [FromBody] Biodata dto)
        {
            var biodata = await _context.Biodatas
                .Include(b => b.Pendidikan)
                .Include(b => b.Pelatihan)
                .Include(b => b.Pekerjaan)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (biodata == null) return NotFound();

            biodata.PosisiYangDilamar = dto.PosisiYangDilamar;
            biodata.Nama = dto.Nama;
            biodata.NoKtp = dto.NoKtp;
            biodata.TempatLahir = dto.TempatLahir;
            biodata.TanggalLahir = dto.TanggalLahir;
            biodata.JenisKelamin = dto.JenisKelamin;
            biodata.Agama = dto.Agama;
            biodata.GolonganDarah = dto.GolonganDarah;
            biodata.Status = dto.Status;
            biodata.AlamatKtp = dto.AlamatKtp;
            biodata.AlamatTinggal = dto.AlamatTinggal;
            biodata.Email = dto.Email;
            biodata.NoTelp = dto.NoTelp;
            biodata.OrangTerdekat = dto.OrangTerdekat;
            biodata.Skill = dto.Skill;
            biodata.BersediaDitempatkan = dto.BersediaDitempatkan;
            biodata.PenghasilanDiharapkan = dto.PenghasilanDiharapkan;

            _context.Pendidikans.RemoveRange(biodata.Pendidikan);
            if (dto.Pendidikan != null)
            {
                foreach (var p in dto.Pendidikan) p.Id = 0;
                biodata.Pendidikan = dto.Pendidikan;
            }

            _context.Pelatihans.RemoveRange(biodata.Pelatihan);
            if (dto.Pelatihan != null)
            {
                foreach (var p in dto.Pelatihan) p.Id = 0;
                biodata.Pelatihan = dto.Pelatihan;
            }

            _context.Pekerjaans.RemoveRange(biodata.Pekerjaan);
            if (dto.Pekerjaan != null)
            {
                foreach (var p in dto.Pekerjaan) p.Id = 0;
                biodata.Pekerjaan = dto.Pekerjaan;
            }

            await _context.SaveChangesAsync();
            return Ok(biodata);
        }

        [HttpDelete("biodata/{id}")]
        public async Task<IActionResult> DeleteBiodata(int id)
        {
            var biodata = await _context.Biodatas.FirstOrDefaultAsync(b => b.Id == id);
            if (biodata != null)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == biodata.UserId);
                if (user != null)
                {
                    _context.Users.Remove(user); // Cascade deletes Biodata as well
                    await _context.SaveChangesAsync();
                }
            }
            return Ok(new { message = "Deleted successfully" });
        }
    }
}
