using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pelindo.API.Models;
using System.Security.Claims;

namespace Pelindo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BiodataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BiodataController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst("id")?.Value ?? "0");
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = GetUserId();
            var biodata = await _context.Biodatas
                .Include(b => b.Pendidikan)
                .Include(b => b.Pelatihan)
                .Include(b => b.Pekerjaan)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            return Ok(biodata);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrUpdateBiodata([FromBody] Biodata dto)
        {
            var userId = GetUserId();
            var biodata = await _context.Biodatas
                .Include(b => b.Pendidikan)
                .Include(b => b.Pelatihan)
                .Include(b => b.Pekerjaan)
                .FirstOrDefaultAsync(b => b.UserId == userId);

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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBiodataById(int id, [FromBody] Biodata dto)
        {
            var userId = GetUserId();
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            var biodata = await _context.Biodatas
                .Include(b => b.Pendidikan)
                .Include(b => b.Pelatihan)
                .Include(b => b.Pekerjaan)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (biodata == null) return NotFound();

            if (biodata.UserId != userId && role != "ADMIN") return Forbid();

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
    }
}
