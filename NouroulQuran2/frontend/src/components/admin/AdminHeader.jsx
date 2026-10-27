export default function AdminHeader() {
  return (
    <header className="admin-header">

      <div>
        <span className="admin-overline">
          ESPACE ADMINISTRATION
        </span>

        <h1>
          Nouroul Qur'An
        </h1>
      </div>

      <div className="admin-user">

        <div className="admin-avatar">
          A
        </div>

        <div>
          <strong>Administrateur</strong>
          <span>Gestionnaire du site</span>
        </div>

      </div>

    </header>
  );
}