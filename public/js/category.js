/*eslint-disable*/
console.clear();
const categoryBtn = document.querySelector("#create-category-button");
const categoryTitle = document.querySelector("#category-title");
const categoryBody = document.querySelector(".category-body");

categoryBtn.addEventListener("click", async(event) => {
    event.preventDefault();
    const res = await fetch("/admin/category", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: categoryTitle.value }),
    })
    const { data:category } = await res.json();
    const html = `
    <tr>
        <td>${category.title}</td>
        <td class="action-categories">
            <a href="/admin/category/edit/${category._id}" class="btn btn-sm btn-warning mr-2">Edit</a>
            <form action="/admin/category/delete/${category._id}?newMethod=DELETE" method="post">
                <button class="btn btn-sm btn-danger" type="submit">Delete</button>
            </form>
        </td>
    </tr>
    `
    categoryBody.insertAdjacentHTML("beforeend", html);
    categoryTitle.value = "";
});