using System.Net;
using Microsoft.AspNetCore.Mvc;
using Nop.Core;
using Nop.Core.Domain.Media;
using Nop.Core.Http.Extensions;
using Nop.Core.Infrastructure;
using Nop.Services.Media;
using Nop.Web.API;
using ILogger = Nop.Services.Logging.ILogger;

namespace Nop.Web.Areas.Api.Controllers;
public partial class DownloadController : BaseApiController
{
    #region Fields

    protected readonly IDownloadService _downloadService;
    protected readonly ILogger _logger;
    protected readonly INopFileProvider _fileProvider;
    protected readonly IWorkContext _workContext;
    private readonly IPictureService _pictureService;

    #endregion

    #region Ctor

    public DownloadController(IDownloadService downloadService,
        ILogger logger,
        INopFileProvider fileProvider, IPictureService pictureService,
        IWorkContext workContext)
    {
        _downloadService = downloadService;
        _logger = logger;
        _fileProvider = fileProvider;
        _workContext = workContext;
        _pictureService = pictureService;
    }

    #endregion

    #region Methods

    [HttpPost("AsyncUploadPicture")]
    public virtual async Task<IActionResult> AsyncUploadPicture()
    {
        //if (!await _permissionService.Authorize(StandardPermissionProvider.UploadPictures))
        //    return Json(new { success = false, error = "You do not have required permissions" }, "text/plain");

        var httpPostedFile = Request.Form.Files.FirstOrDefault();
        if (httpPostedFile == null)
            return new CamelCaseActionResult(new CamelCaseResult
            {
                Data = "No file uploaded",
                StatusCode = HttpStatusCode.BadRequest
            });

        const string qqFileNameParameter = "qqfilename";

        var qqFileName = Request.Form.ContainsKey(qqFileNameParameter)
            ? Request.Form[qqFileNameParameter].ToString()
            : string.Empty;

        var picture = await _pictureService.InsertPictureAsync(httpPostedFile, qqFileName);
        if (picture == null)
            return new CamelCaseActionResult(new CamelCaseResult
            {
                StatusCode = HttpStatusCode.BadRequest,
                Data = "Wrong file format"
            });

        try
        {
            return new CamelCaseActionResult(new CamelCaseResult
            {
                Data = new
                {
                    PictureId = picture.Id,
                    ImageUrl = (await _pictureService.GetPictureUrlAsync(picture, 300)).Url
                },
                StatusCode = HttpStatusCode.OK,
            });

        }
        catch (Exception exc)
        {
            await _logger.ErrorAsync(exc.Message, exc, await _workContext.GetCurrentCustomerAsync());

            return new CamelCaseActionResult(new CamelCaseResult
            {
                Data = "File cannot be saved",
                StatusCode = HttpStatusCode.BadRequest
            });
        }
    }

    [HttpPost("AsyncUpload")]
    public virtual async Task<IActionResult> AsyncUpload()
    {
        var httpPostedFile = await Request.GetFirstOrDefaultFileAsync();
        if (httpPostedFile == null)
            return new CamelCaseActionResult(new CamelCaseResult
            {
                Data = "No file uploaded",
                StatusCode = HttpStatusCode.BadRequest
            });

        var fileBinary = await _downloadService.GetDownloadBitsAsync(httpPostedFile);

        var qqFileNameParameter = "qqfilename";
        var fileName = httpPostedFile.FileName;
        if (string.IsNullOrEmpty(fileName) && await Request.IsFormKeyExistsAsync(qqFileNameParameter))
            fileName = await Request.GetFormValueAsync(qqFileNameParameter);
        //remove path (passed in IE)
        fileName = _fileProvider.GetFileName(fileName);

        var contentType = httpPostedFile.ContentType;

        var fileExtension = _fileProvider.GetFileExtension(fileName);
        if (!string.IsNullOrEmpty(fileExtension))
            fileExtension = fileExtension.ToLowerInvariant();

        var download = new Download
        {
            DownloadGuid = Guid.NewGuid(),
            UseDownloadUrl = false,
            DownloadUrl = string.Empty,
            DownloadBinary = fileBinary,
            ContentType = contentType,
            //we store filename without extension for downloads
            Filename = _fileProvider.GetFileNameWithoutExtension(fileName),
            Extension = fileExtension,
            IsNew = true
        };

        try
        {
            await _downloadService.InsertDownloadAsync(download);

            //when returning JSON the mime-type must be set to text/plain
            //otherwise some browsers will pop-up a "Save As" dialog.
            return new CamelCaseActionResult(new CamelCaseResult
            {
                Data = new
                {
                    DownloadId = download.Id,
                    DownloadUrl = Url.Action("DownloadFile", new { downloadGuid = download.DownloadGuid })
                },
                StatusCode = HttpStatusCode.OK
            });
        }
        catch (Exception exc)
        {
            await _logger.ErrorAsync(exc.Message, exc, await _workContext.GetCurrentCustomerAsync());

            return new CamelCaseActionResult(new CamelCaseResult
            {
                Data = "File cannot be saved",
                StatusCode = HttpStatusCode.BadRequest
            });
        }
    }

    #endregion
}
