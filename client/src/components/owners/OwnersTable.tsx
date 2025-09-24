import { Link } from 'react-router-dom';
import { Owner } from '../../types';

interface OwnersTableProps {
  owners: Owner[];
  hasSearched: boolean;
}

const OwnersTable = ({ owners, hasSearched }: OwnersTableProps) => {
  if (!hasSearched) {
    return <p>Enter a last name and click Find Owner to search.</p>;
  }

  if (owners.length === 0) {
    return <p>No owners found.</p>;
  }

  return (
    <section>
      <h2>{owners.length} Owner{owners.length === 1 ? '' : 's'} found</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th className="hidden-sm hidden-xs">Address</th>
            <th>City</th>
            <th>Telephone</th>
            <th className="hidden-xs">Pets</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td>
                <Link to={`/owners/${owner.id}`}>
                  {owner.firstName} {owner.lastName}
                </Link>
              </td>
              <td className="hidden-sm hidden-xs">{owner.address}</td>
              <td>{owner.city}</td>
              <td>{owner.telephone}</td>
              <td className="hidden-xs">{owner.pets.map((pet) => pet.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default OwnersTable;
