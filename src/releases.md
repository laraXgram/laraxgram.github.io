# Release Notes

<a name="versioning-scheme"></a>
## Versioning Scheme

LaraGram and its other first-party packages follow [Semantic Versioning](https://semver.org). Major framework releases are released every year (~Q1), while minor and patch releases may be released as often as every week. Minor and patch releases should **never** contain breaking changes.

When referencing the LaraGram framework or its components from your application or package, you should always use a version constraint such as `^3.0`, since major releases of LaraGram do include breaking changes. However, we strive to always ensure you may update to a new major release in one day or less.

<a name="named-arguments"></a>
#### Named Arguments

[Named arguments](https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments) are not covered by LaraGram's backwards compatibility guidelines. We may choose to rename function arguments when necessary in order to improve the LaraGram codebase. Therefore, using named arguments when calling LaraGram methods should be done cautiously and with the understanding that the parameter names may change in the future.

<a name="support-policy"></a>
## Support Policy

For all LaraGram releases, bug fixes are provided for 18 months and security fixes are provided for 2 years. For all additional libraries, only the latest major release receives bug fixes. In addition, please review the database versions [supported by LaraGram](/database.md#introduction).

<div class="overflow-auto">

| Version | PHP (*)   | Release         | Bug Fixes Until    | Security Fixes Until |
|---------|-----------|-----------------|--------------------|----------------------|
| 3       | 8.2 - 8.5 | July 17th, 2025 | February 1th, 2027 | July 1th, 2027       |
| 4       | 8.3 - 8.5 | Q2 2026         | Q4 2027            | Q2 2027              |


</div>

<div class="version-colors">
    <div class="end-of-life">
        <div class="color-box"></div>
        <div>End of life</div>
    </div>
    <div class="security-fixes">
        <div class="color-box"></div>
        <div>Security fixes only</div>
    </div>
</div>

(*) Supported PHP versions

<a name="laragram-3"></a>
## LaraGram 3

LaraGram 3 continues the improvements made in LaraGram 2.x by updating upstream dependencies.

<a name="minimal-breaking-changes"></a>
