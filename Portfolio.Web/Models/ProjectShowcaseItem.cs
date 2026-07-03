namespace Portfolio.Web.Models;

public sealed record ProjectShowcaseItem(
    string Slug,
    string Name,
    string Type,
    string Status,
    string Summary,
    string Description,
    IReadOnlyList<string> Tags,
    IReadOnlyList<string> Highlights,
    string? RepositoryUrl = null,
    string? PageUrl = null,
    string? ImagePath = null);
