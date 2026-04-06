import "@typespec/http";
import "@typespec/openapi3";

using TypeSpec.Http;

@service({ title: "Book a call API" })
namespace BookACall;