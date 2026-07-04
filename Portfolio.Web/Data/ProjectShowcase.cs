using Portfolio.Web.Models;

namespace Portfolio.Web.Data;

public static class ProjectShowcase
{
    public static IReadOnlyList<ProjectShowcaseItem> Featured { get; } =
    [
        new(
            Slug: "vivid",
            Name: "Vivid",
            Type: "Minecraft mod",
            Status: "WIP mod",
            Summary: "NeoForge mod work for Minecraft 1.21.1.",
            Description: "Focused on content systems, asset pipelines, world generation, and gameplay mechanics.",
            Tags: ["Java", "NeoForge", "Game systems"],
            Highlights:
            [
                "Minecraft 1.21.1 NeoForge implementation",
                "Custom content and asset pipeline work",
                "Gameplay systems built around life-powered progression"
            ],
            RepositoryUrl: "https://github.com/Banjomann/Vivid"),
        new(
            Slug: "banjo",
            Name: "Banjo",
            Type: "Shared platform",
            Status: "WIP platform",
            Summary: "Shared .NET domain and business foundation.",
            Description: "Supports applications that need clear entity, identity, membership, and lifecycle boundaries.",
            Tags: [".NET", "Architecture", "Domain modeling"],
            Highlights:
            [
                "Internal data, business logic, and utility libraries",
                "Reusable foundation for application backends",
                "Domain structure intended to support TimeKeeper"
            ],
            RepositoryUrl: "https://github.com/Banjomann/Banjo"),
        new(
            Slug: "timekeeper",
            Name: "TimeKeeper",
            Type: "Time keeping app",
            Status: "WIP app",
            Summary: "Time tracking and scheduling application.",
            Description: "Web and desktop front ends backed by a shared business foundation planned around Banjo.",
            Tags: [".NET", "Web", "Desktop", "Scheduling"],
            Highlights:
            [
                "Singular backend with Blazor and MAUI desktop front ends",
                "Time tracking and scheduling workflows",
                "Work-in-progress application architecture"
            ],
            RepositoryUrl: "https://github.com/Banjomann/TimeKeeper")
    ];
}
